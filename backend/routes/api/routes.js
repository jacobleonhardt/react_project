const express = require('express');
const asyncHandler = require('express-async-handler');
const { restoreUser } = require('../../utils/auth');

// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Route } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', restoreUser, asyncHandler( async (req, res) => {

    const id = req.user.id;
    const route = await Route.list(id);

    return res.json(route);
}));

router.post('/', restoreUser, asyncHandler( async (req, res) => {
    const { user_id, name, notes, climb_height } = req.body;
    await Route.add({
        user_id,
        name,
        notes,
        climb_height
    });

    const myClimbs = await Route.list(user_id);
    return res.json(myClimbs);
}));

router.patch(
  '/:id',
  restoreUser,
  asyncHandler(async (req, res) => {

    const { id, user_id, name, notes, total_height } = req.body;
    const climb = await Route.findByPk(id);
    await climb.update({
        name,
        notes,
        total_height,
    })

    // after we update the climb obj, we need to grab the updated arr of objs
    const myClimbs = await Route.list(user_id);
    return res.json(myClimbs);
  }),
);

router.delete(
    '/:id',
    restoreUser,
    asyncHandler( async (req, res) => {
      const { id, user_id } = req.body;
      await Route.delete(id);


      const myClimbs = await Route.list(user_id);
      return res.json(myClimbs);
    })
  );

module.exports = router;
