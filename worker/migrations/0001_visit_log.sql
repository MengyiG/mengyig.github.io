-- Visit log for mengyig.github.io.
-- Every row holds the visitor's IP plus Cloudflare's approximate location and
-- network (for example an ISP or a company's own network).

CREATE TABLE IF NOT EXISTS visits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ip         TEXT,
  country    TEXT,
  region     TEXT,
  city       TEXT,
  org        TEXT,
  path       TEXT,
  referrer   TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS visits_ts ON visits (ts);

CREATE TABLE IF NOT EXISTS questions (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  ts       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ip       TEXT,
  country  TEXT,
  region   TEXT,
  city     TEXT,
  org      TEXT,
  question TEXT
);
CREATE INDEX IF NOT EXISTS questions_ts ON questions (ts);
