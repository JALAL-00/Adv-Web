// src/components/dashboard/RightSidebar.tsx
const RightSidebar = () => {
    return (
        <div className="card w-full bg-base-100 shadow-md border border-gray-200 hidden lg:block">
            <div className="card-body">
                <h2 className="card-title">Add to your feed</h2>
                 <ul className="menu bg-base-100 w-full rounded-box">
                    <li><a>#JavaScript</a></li>
                    <li><a>#React</a></li>
                    <li><a>#Hiring</a></li>
                </ul>
                <button className="btn btn-outline btn-sm mt-2">View all recommendations</button>
            </div>
        </div>
    );
}
export default RightSidebar;