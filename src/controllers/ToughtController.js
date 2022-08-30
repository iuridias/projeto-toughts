const { default: mongoose } = require('mongoose');
const Tought = require('../models/Tought');
const User = require('../models/User');

module.exports = class ToughtController {
  static async showToughts(req, res) {

    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    let order = 'desc';

    if(req.query.order === 'old') {
      order = 'asc'
    } else {
      order = 'desc'
    }

    const toughts= await Tought.find(
      {
        title: {
          $regex: `${search}`,
          $options: 'i'
        }
      }      
      // include: User,
      // where: {
      //   title: {[Op.like]: `%${search}%`}
      // },
      // order: [['createdAt', order]]
    ).populate('user', 'name').sort({
      updatedAt: order
    }).lean();

    // const toughts = toughtsData.map(result => result.get({plain: true}))

    let toughtsQty = Object.keys(toughts).length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render('toughts/home', { toughts, toughtsQty, search });
  }

  static async showDashboard(req, res) {
    const userId = req.session.userid;

    //checar se usuário existe:
    const user = await User.findById(userId);

    if (!user) {
      res.redirect('/login');
    }

    const toughtsByUser = await Tought.find({
      user: userId
    }).lean();

    const toughts = toughtsByUser.map(result => {
      return {
        id: result._id.toString(),
        title: result.title,
        user: result.user
      }
    })

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render('toughts/dashboard', { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render('toughts/create')
  }

  static async createToughtPost(req, res) {
    const user = req.session.userid;

    const tought = {
      title: req.body.tought,
      user
    }

    try {
      const createdTought = new Tought(tought);
      await createdTought.save();

      req.flash('message', 'Pensamento criado com sucesso!')

      req.session.save(() => res.redirect('/toughts/dashboard'));
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    try {
      await Tought.deleteOne({
        _id: id,
        user: userId
      });

      req.flash('message', 'Pensamento removido com sucesso.');
      req.session.save(() => res.redirect('/toughts/dashboard'));
    } catch (error) {
      console.log(error);
    }
  }

  static async editTought(req, res) {
    const id = req.params.id;
    const userId = req.session.userid;

    try {
      const tought = await Tought.findById(id).lean();

      if (!tought || tought.user.toString() !== userId) {
        return res.redirect('/toughts/dashboard')
      }

      res.render('toughts/edit', { tought });
    }
    catch (error) {
      return res.redirect('/toughts/dashboard')
    }
  }

  static async editToughtPost(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    const tought = await Tought.findOne({
      id,
      user: userId
    });

    if (!tought) {
      return res.redirect('/toughts/dashboard');
    }

    const updateTought = {
      title: req.body.tought
    };

    try {
      await Tought.findByIdAndUpdate(
        id,
        updateTought
      );

      req.flash('message', 'Pensamento atualizado com sucesso.');
      req.session.save(() => res.redirect('/toughts/dashboard'));
    } catch (error) {
      console.log(error);
    }
  }
}