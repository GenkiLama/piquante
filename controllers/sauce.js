const Sauce = require("../models/Sauce");
const fs = require("fs");

const createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "sauce enregistrée !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

const getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error: error }));
};

const getSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

const modifySauce = (req, res, next) => {
  let sauceObj = {};

  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce.userId != req.auth.userId) {
      return res.status(401).json({ message: "pas de le droit" });
    } else {
      if (req.file) {
        const name = sauce.imageUrl.split("/images/")[1];
        console.log(name);
        fs.unlink(`images/${name}`, (err) => {
          if (err) console.log(err);
          console.log("Ancienne photo supprimée");
        });
        sauceObj = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObj, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ message: error }));
      } else {
        sauceObj = { ...req.body };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObj, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ message: error }));
      }
    }
  });
};

const deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: "action non autorisée" });
      }
      const name = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${name}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((e) => res.status(400).json({ message: e }));
      });
    })
    .catch((error) => res.status(400).json({ message: "pas le droit", error }));
};

const likeSauce = (req, res, next) => {
  let like = req.body.like;
  let user = req.body.userId;
  switch (like) {
    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: user }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: "Sauce likée" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: user }, $inc: { dislikes: +1 } }
      )
        .then(() => res.status(200).json({ message: "Sauce dislikée" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.indexOf(user) != -1) {
            let usersLiked = sauce.usersLiked;
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersLiked: user }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: "Like enlevé" }))
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.indexOf(user) != -1) {
            let usersDisliked = sauce.usersDisliked;
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersDisliked: user }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: "Dislike enlevé" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
      break;
    default:
      break;
  }
};

module.exports = {
  createSauce,
  getAllSauces,
  getSauce,
  modifySauce,
  deleteSauce,
  likeSauce,
};
