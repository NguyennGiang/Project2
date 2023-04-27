package com.hust.ecommerce.dto;

import com.hust.ecommerce.entity.Address;
import com.hust.ecommerce.entity.Customer;
import com.hust.ecommerce.entity.Order;
import com.hust.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
