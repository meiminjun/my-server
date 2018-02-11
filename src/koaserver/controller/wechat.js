const HomeService = require('../service/home')
module.exports = {
  index: async(ctx, next) => {
    await ctx.render("home/index", {title: "iKcamp欢迎您"})
  }
}
