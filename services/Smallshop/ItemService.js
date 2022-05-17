// Get the model that created before
const ItemModel = require('../../models/mongoose/item');

// Implememting Service class
class ItemService {
  /* Function: used to get all the itmes */
  static async getAllItem() {
    //   CreatedAt: -1 Means the last item was created always be on top
    return ItemModel.find({}).sort({ createdAt: -1 }).exec();
  }

  /* Function: used to get one item by given item Id */
  static async getOneItem(itemId) {
    return ItemModel.findById(itemId).exec();
  }

  /* Function used to create item by give data*/
  static async createItem(data) {
    const item = new ItemModel(data);
    return item.save();
  }

  /* Function used to update the item by given itemId and data*/
  static async updateItem(itemId, data) {
    return ItemModel.findByIdAndUpdate(itemId, data).exec();
  }

  /* Function used to remove item by item Id */
  static async removeItem(itemId) {
    return ItemModel.deleteOne({ _id: itemId }).exec();
  }
}

// Export itemservice
module.exports = ItemService;
