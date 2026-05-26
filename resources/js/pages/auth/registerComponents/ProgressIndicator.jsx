export default function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-full rounded-full ${i < currentStep ? 'bg-primary' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}
