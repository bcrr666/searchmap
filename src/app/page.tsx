import GoogleMap from "@/components/GoogleMap";
import ListResult from "@/components/ListResult";
import HeaderFilters from "@/components/HeaderFilters";

export default function Home() {
    return (
        <div className="w-screen h-screen bg-white">
            <HeaderFilters />
            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div>
                    <GoogleMap />
                </div>
                <div>
                    <ListResult />
                </div>
            </div>
        </div>
    );
}
