const _42 = {
    clientID: "e94c806c424c111e0596a45cb466fe868677b3869bc768ef80660fd20c3ff46e",
    clientSecret: "bd2810211e66e0de56d63537cfef564169e0a05f16fa010e3919c1be7d820fde",
    callbackURL: "http://localhost:3000/auth/42/callback"
};

const github = {
    clientID: "726a7fa48311ebcb6a61",
    clientSecret: "4043430a1e8af57a380e66ff4b0793993f738ff0",
    callbackURL: "http://localhost:3000/auth/github/callback"
};

const gitlab = {
    clientID: "5c458c81ef7cfd05dfd0af3e6b26c090f5837b8dea5429035b43ced6c0f6eb35",
    clientSecret: "d80a2ac13096bdd9a44bfbbbd1974acc49c04cd28cfedcc3452e1be92190d000",
    callbackURL: "http://localhost:3000/auth/gitlab/callback"
};

const google = {
    clientID: "257974825284-hcctgmvqg7jt5buk9cj1og6hs56ll9re.apps.googleusercontent.com",
    clientSecret: "stG1iPLo4xiayl4Xwnt6zaIG",
    callbackURL: "http://localhost:3000/auth/google/callback"
};

module.exports = {
    _42,
    github,
    gitlab,
    google
}