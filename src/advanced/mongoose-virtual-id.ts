export class MongooseVirtualId {
  static virtual(schema: any, virtualName: string) {
    schema.virtual(virtualName).get(function () {
      return this._id;
    });

    schema.set("toJSON", {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
      },
    });
  }
}
