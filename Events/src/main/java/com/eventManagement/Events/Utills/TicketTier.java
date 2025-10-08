//package com.eventManagement.Events.Utills;
//
//public class TicketTier {
//}
package com.eventManagement.Events.Utills;

import jakarta.persistence.Embeddable;

@Embeddable
public class TicketTier {
    private String type;
    private double price;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
