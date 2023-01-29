import prepareMeta from './Utils/prepareMeta'

export default ({ app }, inject) => {
  inject('prepareMeta', prepareMeta)
}
