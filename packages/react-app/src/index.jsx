import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./index.css";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import App from "./App";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const subgraphUri = "http://localhost:4000/graphql";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : "light"}>
      <App subgraphUri={subgraphUri} />
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
