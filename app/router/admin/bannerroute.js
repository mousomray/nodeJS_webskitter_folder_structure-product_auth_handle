const express = require('express');
const routeLabel = require('route-label');
const bannerController = require('../../module/banner/controller/controller');
const { AdminuiAuth } = require('../../middleware/admin_auth/uiauth'); // For UI auth

// Initiallize the express router for router object
const router = express.Router();
const namedRouter = routeLabel(router);

namedRouter.get('addbanner', '/admin/addbanner', AdminuiAuth, bannerController.addbannerGet)
namedRouter.post('addbannercreate', '/admin/addbannercreate', AdminuiAuth, bannerController.addbannerPost)
namedRouter.get('bannerlist', '/admin/bannerlist', AdminuiAuth, bannerController.showbanner)
namedRouter.get('editbanner', '/admin/editbanner/:id', AdminuiAuth, bannerController.singlebanner)
namedRouter.post('updatebanner', '/admin/updatebanner/:id', AdminuiAuth, bannerController.updatebanner)
namedRouter.get('deletebanner', '/admin/deletebanner/:id', AdminuiAuth, bannerController.deletebanner)

module.exports = router; 