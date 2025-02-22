import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

const sampleUser = {
    id: "",
    logo: "",
    name: "",
    rooms: [],
};

const context = createContext<{
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
}>({
    user: sampleUser,
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(sampleUser);

    return (
        <context.Provider value={{ user, setUser }}>
            {children}
        </context.Provider>
    );
};

export const useUser = () => useContext(context);
