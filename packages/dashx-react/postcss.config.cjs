// eslint-disable-next-line turbo/no-undeclared-env-vars
const CONFIG_PATH = process.env.CONFIG_PATH || './tailwind.config.cjs'
module.exports = {
  plugins: {
    tailwindcss: {
      config: require(CONFIG_PATH)
    },
    autoprefixer: {}
  }
}