export default function ProductSkeleton() {
  return (
    <div className="border border-gray-800 bg-secondary/10 p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-900 mb-4" />
      <div className="h-2 w-20 bg-gray-800 mb-2" />
      <div className="h-4 w-full bg-gray-800 mb-4" />
      <div className="h-6 w-24 bg-primary/20" />
    </div>
  );
}
