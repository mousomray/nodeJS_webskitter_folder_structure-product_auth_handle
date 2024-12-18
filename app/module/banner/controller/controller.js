const BannerRepo = require('../repository/bannerrepo')

class bannerAdminController {

    // Banner form
    async addbannerGet(req, res) {
        res.render('banner/addbanner', { user: req.user });
    }

    // Add data in blog
    async addbannerPost(req, res) {
        try {
            const { title } = req.body;
            if (!title) {
                req.flash('err', 'Title is required')
                return res.redirect(generateUrl('addbanner'));
            }
            const bannerData = {
                title: title.trim(),
            };
            await BannerRepo.createBanner(bannerData)
            req.flash('sucess', 'Banner posted sucessfully')
            return res.redirect(generateUrl('bannerlist'));
        } catch (error) {
            console.error('Error saving blog:', error);
            req.flash('err', 'Error posting blog')
            return res.redirect(generateUrl('addbanner'));
        }
    }


    // Banner list
    async showbanner(req, res) {
        try {
            const banners = await BannerRepo.allBanners();
            res.render('banner/bannerlist', { banners, user: req.user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving banners" });
        }
    }

    // Single banner 
    async singlebanner(req, res) {
        const id = req.params.id;
        try {
            const banner = await BannerRepo.oneBanner(id);
            if (!banner) {
                return res.status(404).send('Banner not found');
            }
            res.render('banner/editbanner', { banner, user: req.user });
        } catch (error) {
            console.error('Error fetching banner:', error);
            return res.status(500).send('Error fetching banner');
        }
    }

    // Update banner 
    async updatebanner(req, res) {
        const id = req.params.id;
        try {
            const { title } = req.body;
            if (!title) {
                return res.status(400).send('All fields are required.');
            }
            const bannerData = {
                title: title.trim()
            };
            await BannerRepo.updateBanner(id, bannerData);
            console.log(`Banner with ID ${id} updated`);
            req.flash('sucess', 'Banner updated successfully');
            return res.redirect(generateUrl('bannerlist'));
        } catch (error) {
            console.error('Error updating banner:', error);
            return res.status(500).send('Error updating blog');
        }
    }

    // Handle DELETE for delete banner
    async deletebanner(req, res) {
        const id = req.params.id;
        try {
            await BannerRepo.deleteBanner(id); 
            req.flash('sucess', "Banner delete sucessfully")
            return res.redirect(generateUrl('bannerlist'));
        } catch (error) {
            console.error('Error deleting banner:', error);
            return res.status(500).send('Error deleting banner');
        }
    }

}

module.exports = new bannerAdminController();