import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useContributions } from '@/hooks/useContributions';
import { getContributionStatus } from '@/types/collaboration';
import type { StockDetailItem } from '@/types';
import type { Collaborator } from '@/types/collaboration';

interface Props {
  stockId: number;
  items: StockDetailItem[];
  collaborators: Collaborator[];
  onContributionReviewed: () => void;
}

export const PendingContributionsSection: React.FC<Props> = ({
  stockId,
  items,
  collaborators,
  onContributionReviewed,
}) => {
  const { theme } = useTheme();
  const { contributions, isLoading, load, review } = useContributions(stockId);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleApprove = async (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      await review(Number(e.detail.contributionId), 'APPROVE');
      onContributionReviewed();
    };

    const handleReject = async (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      await review(Number(e.detail.contributionId), 'REJECT');
      onContributionReviewed();
    };

    el.addEventListener('contribution-approve', handleApprove);
    el.addEventListener('contribution-reject', handleReject);
    return () => {
      el.removeEventListener('contribution-approve', handleApprove);
      el.removeEventListener('contribution-reject', handleReject);
    };
  }, [review, onContributionReviewed]);

  if (isLoading) return null;
  if (contributions.length === 0) return null;

  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <section aria-labelledby="contributions-heading" className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 id="contributions-heading" className="text-2xl font-bold">
          Suggestions en attente
        </h2>
        <span className="px-2 py-0.5 text-sm font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
          {contributions.length}
        </span>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contributions.map(contribution => {
          const item = items.find(i => i.id === contribution.itemId);
          const author = collaborators.find(c => c.userId === contribution.contributedBy);
          const status = getContributionStatus(contribution);

          return React.createElement('sh-contribution-card', {
            key: contribution.id,
            'contribution-id': String(contribution.id),
            'item-label': item?.label ?? `Item #${contribution.itemId}`,
            'current-quantity': item?.quantity ?? 0,
            'suggested-quantity': contribution.suggestedQuantity,
            'author-email': author?.userEmail ?? `Utilisateur #${contribution.contributedBy}`,
            'created-at': contribution.createdAt,
            status,
            'data-theme': theme,
          });
        })}
      </div>

      {contributions.length === 0 && (
        <p className={`text-sm ${textMuted}`}>Aucune suggestion en attente.</p>
      )}
    </section>
  );
};
