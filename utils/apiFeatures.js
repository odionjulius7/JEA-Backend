// Sort, Filter, Select, Pagination
class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludeFields = ["sort", "page", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    // Handle additional parameters like category, minPrice, maxPrice, rooms, location
    if (queryObject.category) {
      // Handle category filtering
      this.query = this.query.find({ category: queryObject.category });
      delete queryObject.category;
    }

    // Handle number_of_room filtering
    if (
      queryObject.number_of_room &&
      typeof queryObject.number_of_room === "number"
    ) {
      this.query = this.query.find({
        number_of_room: queryObject.number_of_room,
      });

      delete queryObject.number_of_room;
    }

    if (queryObject.location) {
      this.query = this.query.find({ location: queryObject.location });
      delete queryObject.location;
    }

    // Handle price range filtering
    if (
      queryObject.price.lte &&
      queryObject.price.gte &&
      typeof queryObject.price.gte === "number" &&
      typeof queryObject.price.lte === "number"
    ) {
      const gteValue = parseFloat(queryObject.price.gte);
      const lteValue = parseFloat(queryObject.price.lte);

      if (!isNaN(gteValue) && !isNaN(lteValue)) {
        this.query = this.query.find({
          price: {
            $gte: gteValue,
            $lte: lteValue,
          },
        });
      }

      // Remove the processed parameters
      delete queryObject.price.gte;
      delete queryObject.price.lte;
    }
    // Handle other parameters...

    // Convert the remaining queryObject to a JSON string
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // sort
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy); // e.g DocCat.find().sort(sortBy)
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.query.sort.split(",").join(" ");
      this.query = this.query.select(fields); // e.g await DocCat.find().select(fields)
    } else {
      this.query = this.query.sort("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = apiFeatures;
