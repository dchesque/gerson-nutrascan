import IngredientCard from '../IngredientCard';

export default function IngredientCardExample() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <IngredientCard
        name="Vitamin D3"
        actualDosage="5000 IU"
        idealDosage="4000-5000 IU"
        percentage={95}
        efficacy="high"
        explanation="Excellent dosage. Research shows 4000-5000 IU daily is optimal for most adults to maintain healthy vitamin D levels, support immune function, and bone health."
      />
      <IngredientCard
        name="Vitamin C"
        actualDosage="500 mg"
        idealDosage="1000-2000 mg"
        percentage={45}
        efficacy="medium"
        explanation="Below optimal range. Studies suggest 1000-2000mg daily provides better antioxidant protection and immune support. Current dosage may provide minimal benefits."
      />
      <IngredientCard
        name="Zinc"
        actualDosage="5 mg"
        idealDosage="25-40 mg"
        percentage={18}
        efficacy="low"
        explanation="Severely underdosed. Clinical trials demonstrate 25-40mg daily is needed for immune support and cellular function. This dosage is too low to be effective."
      />
    </div>
  );
}
