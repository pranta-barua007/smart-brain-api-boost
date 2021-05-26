BEGIN TRANSACTION;

INSERT INTO users (
    name,
    email,
    entries,
    age,
    pet,
    joined
) VALUES (
    'elon',
    'elon@gmail.com',
    4,
    33,
    'alien',
    '2021-05-19'
);
INSERT INTO login (
    hash,
    email
) VALUES (
    '$2b$10$pTY8UlEXI0im8.uCCnGR6u3e8VI90EMx0khZhtoEQXHS7z.cxItp6',
    'elon@gmail.com'
);

COMMIT;

/*the hash generates password 'boom'*/