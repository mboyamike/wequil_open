import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout('./layouts/protected-layout.tsx', [
    layout('./layouts/main-layout.tsx', [
      route('/home', "./routes/home.tsx"),
      route("./tweet/:tweetId", "routes/tweet/id.tsx"),
    ])
  ]),
  layout("./layouts/auth-layout.tsx",
    [
      index("routes/login.tsx"),
    ],
  ),
  
] satisfies RouteConfig;
