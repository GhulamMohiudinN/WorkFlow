// FullScreenLoader.jsx
'use client';

export default function FullScreenLoader({ loading }) {
  return (
   <>
    {loading &&  
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          {/* <p className="mt-4 text-gray-600">Loading your workspace...</p> */}
        </div>
      </div>
    }
   </>
  
  );
}