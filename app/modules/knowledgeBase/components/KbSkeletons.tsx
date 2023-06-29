export default function KbSkeletons({ n = 5 }: { n?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: n }).map((_, i) => {
        return (
          <div key={i} className="rounded-md border border-gray-300 bg-white hover:border-theme-500 group">
            <div className="w-full">
              <div className="flex items-center space-x-8 p-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold h-4 w-32 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="mt-2 text-sm h-3 w-48 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="mt-6 flex items-center space-x-2">
                    <div className="text-sm h-4 w-16 bg-gray-300 rounded-md animate-pulse"></div>
                    <div className="text-sm text-gray-300">|</div>
                    <div className="text-sm h-4 w-48 bg-gray-300 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
