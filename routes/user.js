const router = require("express").Router()


router.get("/user", (req, res) => {
    res.json("User test succesful")
})

module.exports = router
