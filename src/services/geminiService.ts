// KAAMLY AI Assistance Service
// Proxies all AI queries through the server-side /api/ai/assist endpoint so API keys are never exposed in browser
import { ApiClient } from './apiClient';

export async function assistJobDescription(category: string, title: string, roughNotes?: string): Promise<string> {
  const notesText = roughNotes ? roughNotes.trim() : '';

  try {
    const res = await ApiClient.getAiAssistance(category, title, roughNotes);
    if (res && res.description) {
      return res.description;
    }
  } catch (err) {
    // Graceful fallback to client curated template if backend or network is temporarily unreachable
  }

  const fallbackTemplates: Record<string, string> = {
    Electrician: `Require a verified electrician for ${title || 'electrical repairs'}. ${notesText ? `Details: ${notesText}. ` : ''}Work involves inspecting wiring, replacing worn switches/fittings, and testing all power connections for safety. Please carry standard tools and testing multimeter. Site is ready.`,
    Plumber: `Need a skilled plumber to inspect and resolve ${title || 'pipe and sanitary repair'}. ${notesText ? `Details: ${notesText}. ` : ''}Please bring standard wrenches, pipe sealant/Teflon tape, and replacement fittings if required. Clean finish expected.`,
    Carpenter: `Looking for a reliable carpenter for ${title || 'woodwork and furniture fitting'}. ${notesText ? `Details: ${notesText}. ` : ''}Work requires precise measurements, secure screw/hinge fixing, and clean alignment. Materials can be arranged as needed.`,
    Painter: `Need an experienced wall painter for ${title || 'surface preparation and painting'}. ${notesText ? `Details: ${notesText}. ` : ''}Includes scraping loose paint, applying putty where needed, and applying smooth uniform coats. Looking for neat workmanship with floor masking.`,
    'Mason / Mistri': `Urgent requirement for a mason/mistri for ${title || 'civil masonry and tile work'}. ${notesText ? `Details: ${notesText}. ` : ''}Proper leveling, cement mix proportion, and clean joint filling required. Water and power available on-site.`,
    'AC Technician': `Need a certified AC technician for ${title || 'AC servicing / inspection'}. ${notesText ? `Details: ${notesText}. ` : ''}Requires deep pressure jet cleaning of indoor and outdoor coils, refrigerant gas pressure check, and drain line flushing.`,
    'Appliance Repair': `Looking for a specialist technician to diagnose and repair ${title || 'home appliance'}. ${notesText ? `Details: ${notesText}. ` : ''}Requires accurate fault finding, transparent estimate for spare parts if any, and warranty on repair.`
  };

  return (
    fallbackTemplates[category] ||
    `Require an experienced ${category} professional for "${title}". ${notesText ? `Specific requirements: ${notesText}. ` : ''}Prompt arrival and quality workmanship expected. Flexible with timing based on mutual agreement.`
  );
}

export function generateWorkerBio(name: string, category: string, experienceYears: number, skills: string[]): string {
  const skillsList = skills.length > 0 ? skills.slice(0, 4).join(', ') : 'residential and commercial maintenance';
  return `Experienced and dependable ${category} with over ${experienceYears} years of hands-on expertise. Specializes in ${skillsList}. Known for punctual service, transparent pricing, quality tools, and customer satisfaction across local neighborhoods.`;
}
