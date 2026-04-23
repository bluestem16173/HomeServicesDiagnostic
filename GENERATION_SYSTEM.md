# GENERATION SYSTEM (HSD PLATFORM)

This is the master generation system to drive programmatic content generation for Cluster Pages, City Pages, and Service Pages on the Home Service Diagnostics (HSD) platform.

## 🧱 MASTER JSON TEMPLATE

```json
{
  "page_type": "cluster | city | service",
  "service": "hvac | plumbing | electrical | windows | roofing",
  "mode": "repair | upgrade",
  "city": "fort-myers-fl",

  "hero": {
    "headline": "",
    "subheadline": "",
    "image_prompt": "",
    "primary_cta": "Start Diagnosis",
    "secondary_cta": "Explore Upgrades"
  },

  "cards": [
    {
      "title": "",
      "description": "",
      "href": "",
      "image_prompt": ""
    }
  ],

  "clusters": [
    {
      "title": "",
      "links": [
        { "label": "", "href": "" }
      ]
    }
  ],

  "trust_row": [
    "Trusted Local Experts",
    "Fast & Accurate",
    "Fix or Upgrade"
  ],

  "cta": {
    "headline": "",
    "subtext": "",
    "button": ""
  }
}
```

## 🔥 EXAMPLES

### 🔴 HVAC CLUSTER PAGE

```json
{
  "page_type": "cluster",
  "service": "hvac",
  "mode": "repair",

  "hero": {
    "headline": "HVAC Problems — Diagnose. Fix. Optimize.",
    "subheadline": "Identify system issues fast and prevent costly breakdowns.",
    "image_prompt": "modern home exterior with HVAC unit, clean lighting, professional inspection feel"
  },

  "cards": [
    {
      "title": "AC Not Cooling",
      "description": "Warm air, airflow issues, or no cooling",
      "href": "/hvac/ac-not-cooling/fort-myers-fl",
      "image_prompt": "hvac unit outside home, realistic lighting, slight wear, diagnostic feel"
    },
    {
      "title": "Strange Noises",
      "description": "Grinding, buzzing, or rattling sounds",
      "href": "/hvac/strange-noises/fort-myers-fl",
      "image_prompt": "close up hvac system components, subtle issue, professional inspection"
    },
    {
      "title": "System Not Starting",
      "description": "No power or startup issues",
      "href": "/hvac/system-not-starting/fort-myers-fl",
      "image_prompt": "thermostat and hvac unit not responding, realistic scene"
    },
    {
      "title": "High Energy Bills",
      "description": "Inefficient performance and wasted energy",
      "href": "/hvac/high-energy-bills/fort-myers-fl",
      "image_prompt": "home utility bill high cost, hvac system background"
    }
  ]
}
```

### 🌆 CITY PAGE (FORT MYERS)

```json
{
  "page_type": "city",
  "service": "hvac",
  "mode": "repair",
  "city": "fort-myers-fl",

  "hero": {
    "headline": "HVAC Services in Fort Myers, FL",
    "subheadline": "Fast, reliable diagnostics and repairs for local homeowners.",
    "image_prompt": "fort myers skyline at sunset, waterfront, residential homes, warm lighting"
  }
}
```

### 💎 UPGRADE PAGE (WINDOW REPLACEMENT)

```json
{
  "page_type": "service",
  "service": "windows",
  "mode": "upgrade",
  "city": "fort-myers-fl",

  "hero": {
    "headline": "Window Replacement in Fort Myers, FL",
    "subheadline": "Upgrade your home with energy-efficient, high-performance windows.",
    "image_prompt": "luxury coastal home interior, large impact windows, bright sunlight, modern design"
  }
}
```

## 🎨 MORPHIC PROMPT SYSTEM

Lock in these prompt structures for consistency across AI image generation models:

- **🔴 Repair prompts:**
  `realistic home issue, subtle problem, professional inspection, clean lighting, no clutter`
- **💎 Upgrade prompts:**
  `luxury modern home, bright natural light, clean interior, high-end materials, minimal design`
- **🌆 City prompts:**
  `[city name] skyline at dusk, warm lighting, residential area, clean and modern`

## 🧠 HVAC REVENUE BOOST STRATEGY (IMPORTANT)

**Core Concept:**
- HSD is the front-facing, clean, premium consumer brand.
- **HVAC Revenue Boost** is the backend / sub-brand. It is NOT consumer-facing directly, but acts as the powering engine.

**Implementation Rules:**
- **Footer (All Pages):** Must include `"Powered by HVAC Revenue Boost"`.
- **Upgrade Pages (Hero/Badges):** Must include `"Performance optimization by HVAC Revenue Boost"`.
