module.exports = {
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/articles",
        permanent: true,
      },
    ];
  },
};
