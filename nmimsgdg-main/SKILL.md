---
name: design-system-ikea-india
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# IKEA India

## Mission
Deliver implementation-ready design-system guidance for IKEA India that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: IKEA India
- URL: https://www.ikea.com/in/en/?gad_source=1&gad_campaignid=23089864506&gbraid=0AAAAADHc5iTDDz86Nk_pZaoUbXrnUhO-3&gclid=Cj0KCQjwt9jVBhDXARIsAFSP-6cJjqAoNFj4O9GkxBSx_I5bf5H4lZNNd2Du8hX8kZjp02EfJT5a5t8aAvx9EALw_wcB
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Saudi Riyal`, `font.family.stack=Saudi Riyal, Noto IKEA, Noto Sans JP, Noto Sans KR, Noto Sans SC, Noto Sans TC, Noto Sans, Roboto, Open Sans, system-ui, sans-serif`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=21.994px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=16.38px`, `font.size.xl=20px`, `font.size.2xl=21px`, `font.size.3xl=22px`, `font.size.4xl=24px`
- Color palette: `color.text.primary=#484848`, `color.text.secondary=#111111`, `color.text.tertiary=#ffffff`, `color.surface.base=#000000`, `color.surface.muted=#f5f5f5`, `color.surface.raised=#e00751`
- Spacing scale: `space.1=4px`, `space.2=6px`, `space.3=8px`, `space.4=12px`, `space.5=15px`, `space.6=16px`, `space.7=24px`, `space.8=32px`
- Radius/shadow/motion tokens: `radius.xs=64px`, `radius.sm=100px` | `shadow.1=rgba(0, 0, 0, 0.1) 0px 4px 16px 0px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
