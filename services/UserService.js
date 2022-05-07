const fs = require('fs');
const util = require('util');

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching users information
 */
class userService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the users data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of users name and short name
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    return data.map((user) => {
      // throw new Error('Async await error');
      return { name: user.name, shortname: user.shortname };
    });
  }

  /**
   * Get all artwork
   */
  async getAllPhotos() {
    const data = await this.getData();

    // Array.reduce() is used to traverse all users and
    // create an array that contains all artwork
    const artwork = data.reduce((acc, elm) => {
      if (elm.artwork) {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...elm.artwork];
      }
      return acc;
    }, []);
    return artwork;
  }

  /**
   * Get all artwork of a given user
   * @param {*} shortname The users short name
   */
  async getArtworkForuser(shortname) {
    const data = await this.getData();
    const user = data.find((elm) => {
      return elm.shortname === shortname;
    });
    if (!user || !user.artwork) return null;
    return user.artwork;
  }

  /**
   * Get all artwork of a given title
   * @param {*} title The users title
   */
  async getArtwork_title(title) {
    const data = await this.getData();
    const user = data.find((elm) => {
      return elm.title === title;
    });
    if (!user || !user.artwork) return null;
    return user.artwork;
  }

  /**
   * Get user information provided a shortname
   * @param {*} shortname
   */
  async getuser(shortname) {
    const data = await this.getData();
    const user = data.find((elm) => {
      return elm.shortname === shortname;
    });
    if (!user) return null;
    return {
      title: user.title,
      name: user.name,
      shortname: user.shortname,
      description: user.description,
      display_title: user.display_title,
      display_body: user.display_body,
    };
  }

  /**
   * Get the information provided a title
   * @param {*} title
   */
  async getInformation(title) {
    const data = await this.getData();
    const user = data.find((elm) => {
      return elm.title === title;
    });
    if (!user) return null;
    return {
      title: user.title,
      name: user.name,
      shortname: user.shortname,
      description: user.description,
      display_title: user.display_title,
      display_body: user.display_body,
    };
  }
  /**
   * Returns a list of users with only the basic information
   */
  async getListShort() {
    const data = await this.getData();
    return data.map((user) => {
      return {
        name: user.name,
        shortname: user.shortname,
        title: user.title,
      };
    });
  }

  /**
   * Get a list of users
   */
  async getList() {
    const data = await this.getData();
    return data.map((user) => {
      return {
        name: user.name,
        shortname: user.shortname,
        title: user.title,
        summary: user.summary,
      };
    });
  }

  /**
   * Fetches users data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data).users;
  }
}

module.exports = userService;
