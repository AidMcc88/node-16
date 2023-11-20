const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let titans = [
    {
        _id: 1,
        name: "Ion",
        class: "Atlas",
        weapon: "Splitter Rifle",
        ability1: "Laser Shot: shoots a fast, powerful laser beam.",
        ability2: "Vortex Shield: Absorbs incoming projectiles and releases them back at enemies.",
        ability3: "Tripwire: Deploys explosive mines that detonate when enemies pass through."
    },
    {
        _id: 2,
        name: "Scorch",
        class: "Ogre",
        weapon: "T-203 Thermite Launcher",
        ability1: "Firewall: Creates a line of fire that damages enemies who pass through it.",
        ability2: "Incendiary Trap: Deploys canisters that release thermite gas when shot.",
        ability3: "Heat Shield: Activates a defensive shield that blocks incoming fire."
    },
    {
        _id: 3,
        name: "Northstar",
        class: "Stryder",
        weapon: "Plasma Railgun",
        ability1: "Cluster Missile: Launches a missile that releases smaller explosive projectiles upon impact.",
        ability2: "VTOL Hover: Allows Northstar to hover in the air for a short duration.",
        ability3: "Tether Traps: Deploys traps that, when triggered, immobilize and damage enemies."
    },
    {
        _id: 4,
        name: "Ronin",
        class: "Stryder",
        weapon: "Leadwall Shotgun",
        ability1: "Sword Block: Reduces incoming damage by blocking with a sword.",
        ability2: "Phase Dash: Quickly teleports in the direction of movement.",
        ability3: "Arc Wave: Sends out a wave of energy that damages and slows enemies."
    },
    {
        _id: 5,
        name: "Tone",
        class: "Atlas",
        weapon: "40mm Tracker Cannon",
        ability1: "Tracker Rockets: Fires tracking rockets at locked-on targets.",
        ability2: "Sonar Lock: Detects and highlights enemies in a certain area.",
        ability3: "Particle Wall: Deploys a defensive energy barrier that blocks incoming fire."
    }
];


app.get("/api/titans", (req, res) => {
    res.send(titans);
});

app.post("/api/titans", upload.single("cover"), (req, res) => {
    const result = validateTitan(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const titan = {
        _id: titans.length + 1,
        name: req.body.name,
        class: req.body.class,
        weapon: req.body.weapon,
        ability1: req.body.ability1,
        ability2: req.body.ability2,
        ability3: req.body.ability3
    }

    titans.push(titan);
    res.send(titans);
});

const validateTitan = (titan) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        class: Joi.string().min(3).required(),
        weapon: Joi.string().min(3).required(),
        ability1: Joi.string().min(5),
        ability2: Joi.string().min(5),
        ability3: Joi.string().min(5) 
    });

    return schema.validate(titan);
};

app.put("/api/titans/:id", (req, res) => {
    const titanIndex = titans.findIndex(a => a._id == parseInt(req.params.id));
    if (titanIndex > -1) {
        for (const key in req.body) {
            if (key in titans[titanIndex]) {
                titans[titanIndex][key] = req.body[key];
            }
        }
        res.send(titans);
    } else {
        res.status(404).send('Titan not found');
    }
});

app.delete("/api/titans/:id", (req, res) => {
    const titanIndex = titans.findIndex(a => a._id == parseInt(req.params.id));
    if (titanIndex > -1) {
        titans.splice(titanIndex, 1);
        res.send(titans);
    } else {
        res.status(404).send('Titan not found');
    }
});

app.listen(3003, () => {
    console.log("I'm listening");
});