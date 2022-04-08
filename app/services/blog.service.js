const autoBind = require('auto-bind');
const { service } = require('@service/service');

class blog extends service {
  /**
   * blog service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    autoBind(this);
  }

  async blogList(queries) {
    try {
      let { orderby, order, limit, page, ...search } = queries;
      let filter = { deleted: false };
      if (search.name != null && search.name.length > 0) {
        filter = { ...filter, name: new RegExp(search.name, 'i') };
      }

      return await this.getAll(queries, filter);
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async blogStore(name, content) {
    try {
      return await this.insert({
        name: name,
        content: content,
        slug: name.split(' ').join('-').toLowerCase(),
        status: true,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async blogDetails(blogId) {
    try {
      let blog = await this.get(blogId);
      if (!blog) {
        throw new Error('Blog not found with this given details.');
      }
      return blog;
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async blogUpdate(blogId, name, content, status) {
    try {
      await this.updateById(blogId, {
        name: name,
        content: content,
        status: status,
      });
      return await this.get(blogId);
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async blogDelete(blogId) {
    try {
      return await this.delete({ _id: blogId });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }
}

module.exports = { blog };
