import { Request } from 'express';
import { Model } from 'mongoose';
export class AdvancedFilter {
  static async filter(
    param: Request,
    model: Model<any>,
    populate?: any,
    subPopulate?: any,
  ) {
    let query;

    const reqQuery = { ...param.query };
    let queryStr = JSON.stringify(reqQuery);

    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach((params) => delete reqQuery[params]);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    query = model.find(JSON.parse(queryStr));

    if (param.query.select) {
      const fields = param.query.select.toString().split(',').join(' ');
      query = query.select(fields);
    }

    if (param.query.sort) {
      const sortBy = param.query.sort.toString().split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    let page = 1;
    if (param.query.page) {
      page = parseInt(param.query.page.toString(), 10) || 1;
    }

    let limit = 10;
    if (param.query.limit) {
      limit = parseInt(param.query.limit.toString(), 10) || 10;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate).populate(subPopulate);
    }

    const results = await query;

    const pagination = {
      next: {
        pages: endIndex < total ? page + 1 : 1,
        limit,
      },
      pre: {
        pages: startIndex > 0 ? page - 1 : 1,
        limit,
      },
    };

    const respone = {
      count: total,
      pagination,
      results,
    };

    return respone;
  }
}
