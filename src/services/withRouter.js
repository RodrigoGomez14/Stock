import { useNavigate, useLocation, useParams } from 'react-router-dom'

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const history = {
      push: (path, state) => navigate(path, { state }),
      replace: (path, state) => navigate(path, { replace: true, state }),
      goBack: () => navigate(-1),
      location: { ...location, props: location.state || {} },
      listen: () => {},
      block: () => () => {},
    }

    return <Component {...props} history={history} params={params} />
  }

  return ComponentWithRouterProp
}

export function RouteInjector({ component: Component, ...rest }) {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const history = {
    push: (path, state) => navigate(path, { state }),
    replace: (path, state) => navigate(path, { replace: true, state }),
    goBack: () => navigate(-1),
    location: { ...location, props: location.state || {} },
    listen: () => {},
    block: () => () => {},
  }

  return <Component {...rest} history={history} params={params} />
}
