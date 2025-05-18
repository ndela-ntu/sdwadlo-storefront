export default async function Page({params}: {params: Promise<{id: string}>}) {
    const awaitedParams = await params;
    
    return <div></div>
}