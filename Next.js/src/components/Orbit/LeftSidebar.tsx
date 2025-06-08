// src/components/dashboard/LeftSidebar.tsx
const LeftSidebar = () => {
    return (
        <div className="card w-full bg-base-100 shadow-md border border-gray-200 hidden lg:block">
            <div className="card-body">
                <div className="flex flex-col items-center text-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src="/images/Jalal.jpg" />
                        </div>
                    </div>
                    <h2 className="card-title mt-4">Jalal Uddin</h2>
                    <p className="text-sm text-gray-500">Frontend Developer at AIUB.</p>
                </div>
                <div className="divider"></div>
                <ul className="menu bg-base-100 w-full rounded-box">
                    <li><a>Connections</a></li>
                    <li><a>My Network</a></li>
                    <li><a>Groups</a></li>
                </ul>
            </div>
        </div>
    );
}
export default LeftSidebar;