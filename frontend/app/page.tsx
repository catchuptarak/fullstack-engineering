export default async function Home() {
  console.log('process.env.NEXT_PUBLIC_API_BASE_URL', process.env.NEXT_PUBLIC_API_BASE_URL);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchMenus = async () => {
    const response = await fetch(`${apiBaseUrl}/menu/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch menu data");
    }

    return response.json();
  };

  const menusData = await fetchMenus();

  const totalMenus = menusData.length;
  // @ts-ignore
  const avgDepth = Math.trunc(
    // @ts-ignore
    menusData.reduce((acc:  number, menu) => acc + (menu.depth || 0), 0) / totalMenus
  );
  
  // @ts-ignore
  const deepestMenu =
    // @ts-ignore
    menusData.length > 0
        // @ts-ignore
      ? Math.max(...menusData.map((menu) => menu.depth || 0))// @ts-ignore
      : 0;

  return (
    <section>
      <h1 className="text-head">Menu Insights</h1>
      <div className="join join-vertical lg:join-horizontal shadow-md w-full">
        <div className="join-item p-10">
          <p className="text-6xl max-sm:text-4xl font-black text-secondary text-center">
            {totalMenus}
          </p>
          <p className="text-center opacity-80">Total Menus</p>
        </div>
        <div className="join-item p-10">
          <p className="text-6xl max-sm:text-4xl font-black text-accent text-center">
            {isNaN(avgDepth) ? 0 : avgDepth}
          </p>
          <p className="text-center opacity-80">Average Depth</p>
        </div>
        <div className="join-item p-10">
          <p className="text-6xl max-sm:text-4xl font-black text-secondary text-center">
            {deepestMenu}
          </p>
          <p className="text-center opacity-80">Deepest Level</p>
        </div>
      </div>
    </section>
  );
}
