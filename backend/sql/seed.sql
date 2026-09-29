DO $$
DECLARE
  v_id BIGINT;
BEGIN
  -- Find an existing version that already has our questions
  SELECT qv.id INTO v_id
  FROM quiz_versions qv
  JOIN questions q ON q.quiz_version_id = qv.id
  WHERE q.question_key = 'lose_track_of_time'
  LIMIT 1;

  -- Deactivate all versions
  UPDATE quiz_versions SET is_active = FALSE;

  IF v_id IS NULL THEN
    INSERT INTO quiz_versions (is_active) VALUES (TRUE) RETURNING id INTO v_id;
  ELSE
    UPDATE quiz_versions SET is_active = TRUE WHERE id = v_id;
  END IF;
END $$;

INSERT INTO questions (quiz_version_id, question_key, question_text, position)
SELECT qv.id, q.question_key, q.question_text, q.position
FROM quiz_versions qv
CROSS JOIN (VALUES
  ('lose_track_of_time',    'I easily lose track of time when doing something I enjoy', 1),
  ('misplace_things',       'I often misplace things like my phone, keys, or wallet',   2),
  ('start_not_finish',      'I frequently start tasks but struggle to finish them',      3),
  ('focus_in_conversation', 'I find it hard to stay focused during conversations or meetings', 4),
  ('forget_daily_tasks',    'I often forget about daily tasks like appointments or returning calls', 5)
) AS q(question_key, question_text, position)
WHERE qv.is_active = TRUE
ON CONFLICT (quiz_version_id, question_key) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  position = EXCLUDED.position;
