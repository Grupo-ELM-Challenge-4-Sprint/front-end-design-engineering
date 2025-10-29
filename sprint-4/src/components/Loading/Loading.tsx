interface LoadingProps {
    loading: boolean;
    message: string;
}

const Loading = ({ loading, message }: LoadingProps) => {
    return loading ? (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className='mt-4 text-lg text-gray-700'>
                    {message}
                </span>
            </div>
        </div>
    ) : null;
};

export default Loading;
