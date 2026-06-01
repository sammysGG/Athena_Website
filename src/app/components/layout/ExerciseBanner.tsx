// Site-wide exercise notice shown as a banner at the bottom of every page.
// Deliberately omits any "restricted access / monitored" wording — its only
// job is to make clear the content is fictional training material.
export default function ExerciseBanner() {
  return (
    <div className="bg-amber-400 text-amber-950 border-t border-amber-500">
      <div className="container py-3 flex items-start gap-2 text-sm leading-snug">
        <span aria-hidden className="font-bold">⚠</span>
        <p>
          <span className="font-semibold">Exercise Athena Strike 2026.</span> Other than some
          images, all names, accounts and information on this site are{" "}
          <strong>purely fictional</strong> and form part of a training exercise. This is not a
          real government system or website.
        </p>
      </div>
    </div>
  );
}
