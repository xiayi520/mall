import {request} from "./request"

export function getDetailData(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}
// 获取推荐信息数据
export function getRecommendData() {
  return request({
    url: '/recommend'
  })
}
// 商品信息
export class GoodsInfo {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.columns = columns
    this.services = services
    this.realPrice = itemInfo.lowNowPrice
  }
}

// 商家信息
export class Shop {
  constructor(shopInfo) {
    // 商家logo
    this.logo = shopInfo.shopLogo;
    // 商家名称
    this.name = shopInfo.name;
    // 
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}
  // 商品参数
  export class GoodsParam {
    constructor(info,rule) {
      // 判断是否有图片，有就展示，没有就返回空
      this.image = info.images ? info.images[0] : '';
      this.infos = info.set;
      this.sizes = rule.tables;
    }
  }