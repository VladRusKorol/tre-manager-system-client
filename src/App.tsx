import { AppNavigator } from './componets/appNavigator/appNavigator'
import { AppRouter } from './componets/appRouter/AppRouter'
import './App.css'
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { useContext, useMemo } from 'react';
import { ErrorLink, onError } from '@apollo/client/link/error';
import { ToastContext } from './contexts/ToastContext';
import { ApolloLink } from '@apollo/client';
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  ServerError,
  UnconventionalError
} from "@apollo/client/errors";


export let client: ApolloClient;
export const cache = new InMemoryCache();

export const App: React.FC = () => {

  const { showToast } = useContext(ToastContext)

  const ErrorLinkHandler = useMemo(() => {

    return new ErrorLink(({ error, operation }) => {
      
      if (CombinedGraphQLErrors.is(error)) {
        error.errors.forEach(({ message, locations, path }) =>
          showToast("error",
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      } 
      
      else if (CombinedProtocolErrors.is(error)) {
        error.errors.forEach(({ message, extensions }) =>
          showToast("error",
            `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
              extensions
            )}`
          )
        );
      } 
      
      else if (UnconventionalError.is(error)) {
        if (typeof error.cause === "symbol") {
          showToast("error", `Non-standard error thrown. A symbol was thrown: ${error.cause.toString()}`);
        } else if (typeof error.cause === "object") {
          showToast("error", `Non-standard error thrown. An object was thrown: ${error.cause}`);
        } else {
          showToast("error", `Non-standard error thrown. Unexpected value thrown:${error.cause})`);
        }
      } 

      else if (ServerError.is(error)) {
        if (error.statusCode === 401) {
          showToast("error", `[Auth error]: Unauthorized client`)
        } else {
          showToast("error", `[Server error]: status: ${error.statusCode} body: ${error.bodyText}`)
        }
      }

      else {
        showToast("error",`[Network error]: ${error}`);
      }
    });
  }, [showToast]);
  
  const Link = useMemo(()=> {
    return new HttpLink({
      uri: "http://localhost:3000/graphql",
      fetchOptions: {mode: "cors"}
    })
  },[])


  client = new ApolloClient({
    cache: cache,
    link: ApolloLink.from([ErrorLinkHandler, Link]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
    },
  });

  return (
    <div className='app-cont'>
      <div className='app-navigator'>
        <AppNavigator/>
      </div>
      <div className="app-content">
        <AppRouter/>
      </div>
    </div>
  )
}

export default App
