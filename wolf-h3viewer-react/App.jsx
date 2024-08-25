import { Page } from "@/components/Page";
import { Layout } from "@/layouts/Layout";
import { useRoutes } from "react-router-dom";
import { Home } from "@/components/Home";
import { Account } from "@/components/Account";

function App() {
    const element = useRoutes([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/new",
            element: <div>work in progress</div>,
        },
        {
            path: "/account",
            element: <Account />,
        },
        {
            path: "/wiki/:hash",
            element: <Page />,
        },
        {
            path: "*",
            element: (
                <div className='text-8xl my-10 font-medium'>
                    <span className='text-[15rem] font-bold tracking-wider'>404</span> <br />
                    Page not found
                </div>
            ),
        },
    ]);

    return <Layout>{element}</Layout>;
}

export default App;
