import crypto from "node:crypto";

const COOKIE_NAME = "howlrex_vault";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function safeEqual(a, b) {
  const aa = Buffer.from(a || "", "utf8");
  const bb = Buffer.from(b || "", "utf8");
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSession(secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString("base64url");
  return payload + "." + sign(payload, secret);
}

function validSession(token, secret) {
  if (!token || !secret) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isFinite(data.exp) && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function cookieValue(req, name) {
  const raw = req.headers.cookie || "";
  const item = raw.split(";").map(v => v.trim()).find(v => v.startsWith(name + "="));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : "";
}

export default function handler(req, res) {
  const password = process.env.HOWLREX_VAULT_PASSWORD;
  const sessionSecret = process.env.HOWLREX_VAULT_SESSION_SECRET;
  const vaultRecord = process.env.HOWLREX_VAULT_RECORD || "";

  if (!password || !sessionSecret) {
    return json(res, 503, { ok: false, error: "Vault security is not configured." }, {
      "Cache-Control": "no-store"
    });
  }

  if (req.method === "GET") {
    const authenticated = validSession(cookieValue(req, COOKIE_NAME), sessionSecret);
    return json(res, 200, {
      ok: authenticated,
      record: authenticated ? vaultRecord : ""
    }, {
      "Cache-Control": "no-store"
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { ok: false, error: "Method not allowed." }, {
      "Cache-Control": "no-store"
    });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, { ok: false, error: "Invalid request." }, {
      "Cache-Control": "no-store"
    });
  }

  if (body.action === "logout") {
    return json(res, 200, { ok: true }, {
      "Set-Cookie": COOKIE_NAME + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
      "Cache-Control": "no-store"
    });
  }

  const supplied = typeof body.password === "string" ? body.password : "";
  if (!safeEqual(sha256(supplied), sha256(password))) {
    return json(res, 401, { ok: false, error: "Access denied." }, {
      "Cache-Control": "no-store"
    });
  }

  const token = createSession(sessionSecret);
  return json(res, 200, { ok: true }, {
    "Set-Cookie": COOKIE_NAME + "=" + encodeURIComponent(token) + "; Path=/; Max-Age=" + SESSION_TTL_SECONDS + "; HttpOnly; Secure; SameSite=Strict",
    "Cache-Control": "no-store"
  });
}
