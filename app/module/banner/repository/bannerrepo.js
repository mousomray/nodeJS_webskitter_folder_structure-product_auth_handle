const BannerModel = require('../model/banner');

class BannerRepo {

    // Add banner function
    async createBanner(bannerData) {
        const banner = new BannerModel(bannerData);
        return await banner.save();
    }

    // All banners function
    async allBanners() {
        const banners = await BannerModel.find();
        return banners;
    }

    // single banner function 
    async oneBanner(id) {
        const banner = await BannerModel.findById(id);
        return banner;
    }

    // Update banner 
    async updateBanner(id, bannerData) {
        return await BannerModel.findByIdAndUpdate(id, bannerData)
    }

    // Delete banner 
    async deleteBanner(id) {
        return await BannerModel.findByIdAndDelete(id);
    }
}

module.exports = new BannerRepo(); 
