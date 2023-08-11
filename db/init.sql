-- CREATE DATABASE IF NOT EXISTS antifraudedb
SELECT 'CREATE DATABASE antifraudedb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'antifraudedb')\gexec