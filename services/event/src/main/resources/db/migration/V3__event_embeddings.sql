-- Semantic search embeddings table
CREATE TABLE IF NOT EXISTS event_embeddings (
  event_id BIGINT PRIMARY KEY,
  embedding_json MEDIUMTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_embeddings_event
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX idx_event_embeddings_updated_at ON event_embeddings(updated_at);

