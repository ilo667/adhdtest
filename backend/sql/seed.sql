INSERT INTO quiz_versions (version, is_active)
VALUES (1, TRUE)
    ON CONFLICT (version) DO NOTHING;

INSERT INTO questions (
    quiz_version_id,
    question_key,
    question_text,
    position
)
SELECT
    qv.id,
    q.question_key,
    q.question_text,
    q.position
FROM quiz_versions qv
         CROSS JOIN (
    VALUES
        ('lose_track_of_time', 'I easily lose track of time when doing something I enjoy.', 1),
        ('misplace_things',    'I often misplace things like my phone, keys, or wallet.', 2),
        ('start_not_finish',   'I frequently start tasks but struggle to finish them.', 3),
        ('focus_in_conversation', 'I find it hard to stay focused during conversations or meetings.', 4),
        ('forget_daily_tasks', 'I often forget about daily tasks like appointments or returning calls.', 5)
) AS q(question_key, question_text, position)
WHERE qv.version = 1
    ON CONFLICT (quiz_version_id, question_key) DO NOTHING;