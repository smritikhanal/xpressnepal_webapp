describe('Order Status Utilities', () => {
  type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  describe('Status Progression', () => {
    const getStatusIndex = (status: OrderStatus) => {
      const statuses: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered'];
      return statuses.indexOf(status);
    };

    it('returns correct index for each status', () => {
      expect(getStatusIndex('placed')).toBe(0);
      expect(getStatusIndex('confirmed')).toBe(1);
      expect(getStatusIndex('shipped')).toBe(2);
      expect(getStatusIndex('delivered')).toBe(3);
    });

    it('returns -1 for cancelled status', () => {
      expect(getStatusIndex('cancelled')).toBe(-1);
    });
  });

  describe('Status Comparison', () => {
    const isStatusCompleted = (currentStatus: OrderStatus, checkStatus: OrderStatus) => {
      const statuses: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered'];
      const currentIndex = statuses.indexOf(currentStatus);
      const checkIndex = statuses.indexOf(checkStatus);
      return currentIndex >= checkIndex;
    };

    it('correctly identifies completed statuses', () => {
      expect(isStatusCompleted('shipped', 'placed')).toBe(true);
      expect(isStatusCompleted('shipped', 'confirmed')).toBe(true);
      expect(isStatusCompleted('shipped', 'shipped')).toBe(true);
    });

    it('correctly identifies incomplete statuses', () => {
      expect(isStatusCompleted('placed', 'confirmed')).toBe(false);
      expect(isStatusCompleted('confirmed', 'shipped')).toBe(false);
      expect(isStatusCompleted('shipped', 'delivered')).toBe(false);
    });
  });

  describe('Status Color Coding', () => {
    const getStatusColor = (status: OrderStatus) => {
      const colors: Record<OrderStatus, string> = {
        placed: 'blue',
        confirmed: 'yellow',
        shipped: 'orange',
        delivered: 'green',
        cancelled: 'red',
      };
      return colors[status];
    };

    it('returns correct color for each status', () => {
      expect(getStatusColor('placed')).toBe('blue');
      expect(getStatusColor('confirmed')).toBe('yellow');
      expect(getStatusColor('shipped')).toBe('orange');
      expect(getStatusColor('delivered')).toBe('green');
      expect(getStatusColor('cancelled')).toBe('red');
    });
  });

  describe('Status Label', () => {
    const getStatusLabel = (status: OrderStatus) => {
      const labels: Record<OrderStatus, string> = {
        placed: 'Order Placed',
        confirmed: 'Order Confirmed',
        shipped: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      };
      return labels[status];
    };

    it('returns correct label for each status', () => {
      expect(getStatusLabel('placed')).toBe('Order Placed');
      expect(getStatusLabel('confirmed')).toBe('Order Confirmed');
      expect(getStatusLabel('shipped')).toBe('Out for Delivery');
      expect(getStatusLabel('delivered')).toBe('Delivered');
      expect(getStatusLabel('cancelled')).toBe('Cancelled');
    });
  });

  describe('Next Status', () => {
    const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
      const progression: Record<string, OrderStatus | null> = {
        placed: 'confirmed',
        confirmed: 'shipped',
        shipped: 'delivered',
        delivered: null,
        cancelled: null,
      };
      return progression[currentStatus];
    };

    it('returns next status in progression', () => {
      expect(getNextStatus('placed')).toBe('confirmed');
      expect(getNextStatus('confirmed')).toBe('shipped');
      expect(getNextStatus('shipped')).toBe('delivered');
    });

    it('returns null for final statuses', () => {
      expect(getNextStatus('delivered')).toBeNull();
      expect(getNextStatus('cancelled')).toBeNull();
    });
  });

  describe('Can Cancel Order', () => {
    const canCancelOrder = (status: OrderStatus) => {
      return status === 'placed' || status === 'confirmed';
    };

    it('allows cancellation for early statuses', () => {
      expect(canCancelOrder('placed')).toBe(true);
      expect(canCancelOrder('confirmed')).toBe(true);
    });

    it('prevents cancellation for later statuses', () => {
      expect(canCancelOrder('shipped')).toBe(false);
      expect(canCancelOrder('delivered')).toBe(false);
      expect(canCancelOrder('cancelled')).toBe(false);
    });
  });

  describe('Progress Percentage', () => {
    const getProgressPercentage = (status: OrderStatus) => {
      const percentages: Record<OrderStatus, number> = {
        placed: 25,
        confirmed: 50,
        shipped: 75,
        delivered: 100,
        cancelled: 0,
      };
      return percentages[status];
    };

    it('returns correct progress percentage', () => {
      expect(getProgressPercentage('placed')).toBe(25);
      expect(getProgressPercentage('confirmed')).toBe(50);
      expect(getProgressPercentage('shipped')).toBe(75);
      expect(getProgressPercentage('delivered')).toBe(100);
      expect(getProgressPercentage('cancelled')).toBe(0);
    });
  });
});
