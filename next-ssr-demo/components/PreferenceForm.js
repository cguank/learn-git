import { savePreferredCategory } from "../app/actions";

export default function PreferenceForm({ categories, preferredCategory }) {
  return (
    <form action={savePreferredCategory} className="preferenceForm">
      <label className="field">
        <span>默认分类偏好</span>
        <select name="category" defaultValue={preferredCategory}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "全部" : category}
            </option>
          ))}
        </select>
      </label>
      <button className="secondaryButton" type="submit">
        保存到 Cookie
      </button>
    </form>
  );
}
